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
  let totalRepos = 0;
  let date = new Date();
  let currentMonth = date.getMonth() + 1;
  let updatedAt = data.updated_at.split('-')[1];

  let status = "Offline";
  let statusFill = "#676767"
  let opacity = 1;
  let state = ""

  if(currentMonth == updatedAt){
    status = "Online";
    statusFill = "#238636"
    state = "infinite"
    opacity = 0
  }


  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }

    if (repo.stargazers_count != 0) {
      starsEarned += repo.stargazers_count;
    }

    totalRepos = totalRepos + 1;
  });

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const joinedDate = new Date(data.created_at).toLocaleDateString();

  return `
    <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
      <style>
        .background { fill: ${colors.background}; }
        .text { fill: ${colors.text}; font-family: sans-serif; }
        .text-bold { font-weight: bold; }
        .rounded { rx: 5; ry: 5; }
        .star { stroke: ${colors.text}; fill: none; stroke-width: 1; }
        .icons { fill: ${colors.text} }

        /* Animation styles */
        .animate {
          opacity: 0;
          animation: fadeIn .7s ease-in-out forwards;
        }

        .status{
          opacity: ${opacity};
          animation: status 1s ease-in-out ${state};
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

        @keyframes status {
          from { opacity: 0; }
          to { opacity: 1; }
        }

      </style>

      <title>${data.name || data.login} Github Stats</title>
      
      <rect x="0" y="0" width="428" height="328" fill="${colors.background}" class="rounded"/>

      <!-- Username and Bio -->
      <rect x="10" y="10" width="409" height="60" fill="${colors.gridBackground}" class="rounded"/>
      <text x="20" y="35" class="text text-bold animate animate-1" font-size="18">${data.name || data.login}</text>
      <text x="20" y="55" class="text animate animate-1" font-size="14">${data.bio || "No bio, But I'm awesome"}</text>
      
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

      <!-- Total Repos -->
      <rect x="10" y="270" width="130" height="50" fill="${colors.gridBackground}" class="rounded"/>
      <text x="20" y="290" class="text text-bold animate animate-5" font-size="14">Total Repos</text>
      <path class="icons animate animate-5" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" transform="translate(20, 298)" />
      <text x="40" y="310" class="text animate animate-5" font-size="12">${totalRepos}</text>

      <!-- Total Followers -->
      <rect x="150" y="270" width="130" height="50" fill="${colors.gridBackground}" class="rounded"/>
      <text x="160" y="290" class="text text-bold animate animate-5" font-size="14">Followers</text>
      <path class="icons animate animate-5" d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" transform="translate(160, 297)" />
      <text x="180" y="310" class="text animate animate-5" font-size="12">${data.followers}</text>

      <!-- User Status -->
      <rect x="290" y="270" width="130" height="50" fill="${colors.gridBackground}" class="rounded"/>
      <text x="300" y="290" class="text text-bold animate animate-5" font-size="14">Status</text>
      <rect x="300" y="298" width="10" height="10" class="rounded animate animate-4 status" fill="${statusFill}" />
      <text x="315" y="308" class="text animate animate-5" font-size="12">${status}</text>
    </svg>
  `;

  function getLanguageColor(language) {
    const colors = {
      HTML: "#e34c26",
      CSS: "#563d7c",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      C: "#555555",
      Java: "#B07319",
      Python: "#3572A5",
      Vue: "#41b883",
      Ruby: "#701516",
      Rust: "#dea584",
      Dockerfile: "#384d54",
      Shell: "#89e051",
      HCL: "#844FBA",
      Jinja: "#a52a22",
      Mustache: "#724b3b",
      Processing: "#0095D8",
      "C++": "#F34C7D",
      "Jupyter Notebook": "#DA5C0B",
    };
    return colors[language] || "#ccc";
  }
}
