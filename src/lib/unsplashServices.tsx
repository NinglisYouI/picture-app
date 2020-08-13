const baseURL = 'https://api.unsplash.com/'
const accessKey = '4zWcb-F_-svyZOyAWBhtJosd7xjHScDVW382lyIfcQY'

export const unsplashSearch = (searchTerm: string): Promise<Response> => {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    return fetch(`${baseURL}/search/photos?query=${encodedSearchTerm}&client_id=${accessKey}&per_page=20`)
    .then(res => res.json())

}