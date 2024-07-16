import axios from "axios";

export default async function createSVG(data) {
  let response = await axios.get(`https://api.github.com/users/${data.login}/repos?per_page=1000`);
  let repos = response.data;

  let languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const joinedDate = new Date(data.created_at).toLocaleDateString();

  return `
    <svg width="400" height="270" xmlns="http://www.w3.org/2000/svg">
      <style>
        .background { fill: #18181b; }
        .text-light { fill: #e5e5e5; font-family: sans-serif; }
        .text-dark { fill: #333; font-family: sans-serif; }
        .text-bold { font-weight: bold; }
        .border { stroke: gray; stroke-width: 1; }
        .rounded { rx: 5; ry: 5; }
      </style>
      
      <rect x="0" y="0" width="400" height="300" fill="#000" class="border"/>
      
      <!-- Username and Bio -->
      <rect x="10" y="10" width="380" height="60" class="background rounded"/>
      <text x="20" y="35" class="text-light text-bold" font-size="18">${data.name}</text>
      <text x="20" y="55" class="text-light" font-size="14">${data.bio || "No bio available"}</text>
      
      <!-- Profile Image -->
      <rect x="10" y="80" width="180" height="180" class="background rounded"/>
      <image href="${data.avatar_url}" x="20" y="90" width="160" height="160" class="rounded"/>
      
      <!-- Top Languages -->
      <rect x="200" y="80" width="190" height="120" class="background rounded"/>
      <text x="210" y="100" class="text-light text-bold" font-size="14">Top Languages:</text>
      ${topLanguages.map((lang, index) => `
        <rect x="220" y="${110 + index * 20}" width="10" height="10" fill="${getLanguageColor(lang[0])}" />
        <text x="240" y="${120 + index * 20}" class="text-light" font-size="12">${lang[0]}</text>
      `).join('')}
      
      <!-- Joined Date -->
      <rect x="200" y="210" width="190" height="50" class="background rounded"/>
      <text x="210" y="230" class="text-light text-bold" font-size="14">Since</text>
      <text x="210" y="250" class="text-light" font-size="12">${joinedDate}</text>
    </svg>
  `;

  function getLanguageColor(language) {
    const colors = {
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      Ruby: "#701516",
      CSS: "#563d7c",
      HTML: "#e34c26",
      // Add other language colors as needed
    };
    return colors[language] || "#ccc";
  }
}
