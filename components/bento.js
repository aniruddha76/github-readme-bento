import axios from "axios";

export default async function createBentoSVG(data) {
  let response = await axios.get(`https://api.github.com/users/${data.login}/repos?per_page=1000`);
  let repos = response.data;

  let languages = {};
  let starsEarned = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }

    if(repo.stargazers_count != 0){
      starsEarned += repo.stargazers_count
    }
  });

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const joinedDate = new Date(data.created_at).toLocaleDateString();

  return `
    <svg width="429" height="270" xmlns="http://www.w3.org/2000/svg">
      <style>
        .background { fill: #18181b; }
        .text-light { fill: #e5e5e5; font-family: sans-serif; }
        .text-dark { fill: #333; font-family: sans-serif; }
        .text-bold { font-weight: bold; }
        .border { stroke: white; stroke-width: 1; }
        .rounded { rx: 5; ry: 5; }
        .star { stroke: white; fill: none; stroke-width: 1; }
      </style>

      <title>${data.name} Github Stats</title>
      
      <rect x="0" y="0" width="429" height="270" fill="#000" class="border rounded"/>
      
      <!-- Username and Bio -->
      <rect x="10" y="10" width="409" height="60" class="background rounded"/>
      <text x="20" y="35" class="text-light text-bold" font-size="18">${data.name}</text>
      <text x="20" y="55" class="text-light" font-size="14">${data.bio || "No bio available"}</text>
      
      <!-- Profile Image -->
      // <rect x="10" y="80" width="180" height="180" class="background rounded"/>
      <image href="${data.avatar_url}" x="10" y="80" width="180" height="180" class="rounded"/>
      
      <!-- Top Languages -->
      <rect x="200" y="80" width="220" height="120" class="border rounded"/>
      <text x="210" y="100" class="text-light text-bold" font-size="14">Top Languages:</text>
      ${topLanguages.map((lang, index) => `
        <rect x="${210 + (index >= 4 ? 90 : 0)}" y="${110 + (index % 4) * 20}" width="10" height="10" class="rounded" fill="${getLanguageColor(lang[0])}" />
        <text x="${230 + (index >= 4 ? 90 : 0)}" y="${120 + (index % 4) * 20}" class="text-light" font-size="12">${lang[0]}</text>
      `).join('')}

      <!-- Stars Earned -->
      <rect x="200" y="210" width="120" height="50" class="border rounded"/>
      <text x="210" y="230" class="text-light text-bold" font-size="14">Total Stars</text>
      <path d="M215 243 l1.4 -4 l1.2 4 l3.8 0 l-3 2.5 l1 4 l-3 -2.5 l-3 2.5 l1 -4 l-3 -2.5 z" class="star"/>
      <text x="230" y="250" class="text-light" font-size="12">${starsEarned}</text>

      <!-- Joined Date -->
      <rect x="330" y="210" width="90" height="50" class="background rounded"/>
      <text x="340" y="230" class="text-light text-bold" font-size="14">Since</text>
      <text x="340" y="250" class="text-light" font-size="12">${joinedDate}</text>
    </svg>
  `;

  function getLanguageColor(language) {
    const colors = {
      HTML: "#e34c26",
      CSS: "#563d7c",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      C: "#555555",
      Java: "#b07219",
      Python: "#3572A5",
      Vue: "#41b883",
      Ruby: "#701516",
      // Add other language colors as needed
    };
    return colors[language] || "#ccc";
  }
}
