export function getNewsData() {
    return(dispatch: any) =>{
        return fetch('https://mighty-dawn-74394.herokuapp.com/live')
            .then(response => response.json())
            .then(articles => {
                dispatch(updateNewsData(articles));
            }).catch(error => console.log(error)
        );
    }
}

export function updateNewsData(data: any) {
    return {
        type: 'UPDATE_NEWS_ARTICLES',
        articles: data
    }
}

export function updateFeed(data: any) {
    return {
        type: 'UPDATE_NEWS_FEED',
        article: data
    }
}

export function setFeed(data: any) {
    return {
        type: 'SET_NEWS_FEED',
        articles: data
    }
}