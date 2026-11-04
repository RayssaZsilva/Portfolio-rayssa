
import json
import time
import urllib.error
import urllib.request

GITHUB_USERNAME = "RayssaZsilva"

CACHE_DURATION = 300

_cache = {
    "data": None,
    "timestamp": 0,
}


def get_github_projects():
    agora = time.time()

    if (
        _cache["data"] is not None
        and agora - _cache["timestamp"] < CACHE_DURATION
    ):
        return _cache["data"]

    url = (
        f"https://api.github.com/users/"
        f"{GITHUB_USERNAME}/repos"
        "?per_page=100&sort=updated"
    )

    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "Chat-rAI-Portfolio",
        },
    )

    try:
        with urllib.request.urlopen(
            request, timeout=8
        ) as response:
            repositories = json.load(response)

        projects = []

        for repo in repositories:
            if repo.get("fork"):
                continue

            projects.append({
    "nome": repo.get("name"),
    "descricao": repo.get("description"),
    "linguagem": repo.get("language"),
    "github": repo.get("html_url"),
    "site": repo.get("homepage"),
    "criado_em": repo.get("created_at"),
    "ultimo_push_em": repo.get("pushed_at"),
    "atualizado_em": repo.get("updated_at"),
})


        _cache["data"] = projects
        _cache["timestamp"] = agora

        return projects

    except (
        urllib.error.URLError,
        TimeoutError,
        ValueError,
    ) as error:
        print(f"Erro na consulta ao GitHub: {error}")
        return _cache["data"] or []
