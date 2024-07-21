import axios from "axios";

export default async function createBentoSVG(data, theme) {
  const themeColor = {
    light: {
      background: '#ffffff',
      gridBackground: '#e5e5e5',
      text: '#000000',
    },
    dark: {
      background: "#000",
      gridBackground: '#18181b',
      text: '#e5e5e5',
    },
  };

  const colors = themeColor[theme] || themeColor.light;

  let response = await axios.get(`https://api.github.com/users/${data.login}/repos?per_page=1000`);
  let repos = response.data;
  
  let imageResponse = await axios.get(data.avatar_url, { responseType: 'arraybuffer' });
  let base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
  let imageSrc = `data:image/png;base64,${base64Image}`;

  let languages = {};
  let starsEarned = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }

    if(repo.stargazers_count != 0){
      starsEarned += repo.stargazers_count;
    }
  });

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const joinedDate = new Date(data.created_at).toLocaleDateString();

  return `
    <svg width="429" height="270" xmlns="http://www.w3.org/2000/svg">
      <style>
        .background { fill: ${colors.background}; }
        .text { fill: ${colors.text}; font-family: sans-serif; }
        .text-bold { font-weight: bold; }
        .rounded { rx: 5; ry: 5; }
        .star { stroke: ${colors.text}; fill: none; stroke-width: 1; }

        /* Animation styles */
        .animate {
          opacity: 0;
          animation: fadeIn .7s ease-in-out forwards;
        }

        .animate-1 { animation-delay: 0.4s; }
        .animate-2 { animation-delay: 0.6s; }
        .animate-3 { animation-delay: 0.8s; }
        .animate-4 { animation-delay: 1s; }
        .animate-5 { animation-delay: 1.2s; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>

      <title>${data.name} Github Stats</title>
      
      <rect x="0" y="0" width="429" height="270" fill="${colors.background}" class="rounded"/>

      <!-- Username and Bio -->
      <rect x="10" y="10" width="409" height="60" fill="${colors.gridBackground}" class="rounded"/>
      <text x="20" y="35" class="text text-bold animate animate-1" font-size="18">${data.name}</text>
      <text x="20" y="55" class="text animate animate-1" font-size="14">${data.bio || "No bio available"}</text>
      
      <!-- Profile Image -->
      <image href="${imageSrc}" x="10" y="80" width="180" height="180" class="rounded animate animate-2"/>
      
      <!-- Top Languages -->
      <rect x="200" y="80" width="220" height="120" fill="${colors.gridBackground}" class="rounded"/>
      <text x="210" y="100" class="text text-bold animate animate-3" font-size="14">Top Languages:</text>
      ${topLanguages.map((lang, index) => `
        <rect x="${210 + (index >= 4 ? 90 : 0)}" y="${110 + (index % 4) * 20}" width="10" height="10" class="rounded animate animate-4" fill="${getLanguageColor(lang[0])}" />
        <text x="${230 + (index >= 4 ? 90 : 0)}" y="${120 + (index % 4) * 20}" class="text animate animate-4" font-size="12">${lang[0]}</text>
      `).join('')}
      
      <!-- Stars Earned -->
      <rect x="200" y="210" width="120" height="50" fill="${colors.gridBackground}" class="rounded"/>
      <text x="210" y="230" class="text text-bold animate animate-5" font-size="14">Total Stars</text>
      <path d="M215 243 l1.4 -4 l1.2 4 l3.8 0 l-3 2.5 l1 4 l-3 -2.5 l-3 2.5 l1 -4 l-3 -2.5 z" class="star animate animate-5"/>
      <text x="230" y="250" class="text animate animate-5" font-size="12">${starsEarned}</text>

      <!-- Joined Date -->
      <rect x="330" y="210" width="90" height="50" fill="${colors.gridBackground}" class="rounded"/>
      <text x="340" y="230" class="text text-bold animate animate-5" font-size="14">Since</text>
      <text x="340" y="250" class="text animate animate-5" font-size="12">${joinedDate}</text>
    </svg>
  `;

  function getLanguageColor(language) {
    const colors = {
      // Add other language colors as needed
      HTML: "#e34c26",
      CSS: "#563d7c",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      C: "#555555",
      Java: "#b07219",
      Python: "#3572A5",
      Vue: "#41b883",
      Ruby: "#701516",
      Rust: "#dea584",
      // "C++": "#f34b7d",
    };
    return colors[language] || "#ccc";
  }
}
