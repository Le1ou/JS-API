document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector(".container");
    const gitIcon = document.createElement("img");
    gitIcon.classList.add("gitLogo");
    gitIcon.setAttribute("src", "img/logo.png")
    gitIcon.setAttribute("alt", "Логотип GitHub")

    const heading = document.createElement("h1")
    heading.textContent = "Список репозиториев";

    const createSearchInput = document.createElement("input");
    createSearchInput.classList.add("form-repo");
    createSearchInput.setAttribute("type", "text");
    createSearchInput.setAttribute("id", "repo-search");
    createSearchInput.setAttribute("placeholder", "Введите название репозитория...");

    const createAutocompleteList = document.createElement("ul");
    createAutocompleteList.classList.add("autocomplete-list");
    createAutocompleteList.setAttribute("id", "autocomplete-list");

    const createRepoList = document.createElement("ul");
    createRepoList.classList.add("repo-list");
    createRepoList.setAttribute("id", "repo-list");

    container.appendChild(gitIcon);
    container.appendChild(heading);
    container.appendChild(createSearchInput);
    container.appendChild(createAutocompleteList);
    container.appendChild(createRepoList);
    
    const searchInput = document.getElementById('repo-search');
    const autocompleteList = document.getElementById('autocomplete-list');
    const repoList = document.getElementById('repo-list');

    function addRepository(repo) {
        const repoHTML = `
            <li><div class="repo-list-info">
                    <div>Name: ${repo.full_name}</div>
                    <div>Owner: ${repo.owner.login}</div>
                    <div>Stars: ${repo.stargazers_count}</div>
                </div>    
                <button class="remove-btn">
                    <img alt="Удалить" src="img/remove.svg">
                </button>
            </li>
        `;
        repoList.insertAdjacentHTML('beforeend', repoHTML);

        searchInput.value = '';
        autocompleteList.innerHTML = '';

        const newRepoItem = repoList.lastElementChild;
        newRepoItem.querySelector('.remove-btn').addEventListener('click', () => {
            repoList.removeChild(newRepoItem);
        });
    }

    function displayAutocomplete(repos) {
        autocompleteList.innerHTML = '';
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.textContent = repo.full_name;
            li.addEventListener('click', () => addRepository(repo));
            autocompleteList.appendChild(li);
        });
    }

    async function fetchRepositories() {
        const query = searchInput.value.trim();
        if (!query) {
            autocompleteList.innerHTML = '';
            return;
        }

        try {
        let response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        let data = await response.json();
        displayAutocomplete(data.items);
        } catch (error) {
            throw new Error ("ошибка при выборке репозиториев", error)
        }
    }

    let debounceTimeout;
    const debounceDelay = 400;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fetchRepositories, debounceDelay);
    });
});
