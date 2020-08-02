const initData = {
    newsArticles: []
}

const newsReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_NEWS_ARTICLES':
        return {
            ...state,
            newsArticles: action.articles
        }
    case 'UPDATE_NEWS_FEED': 
        return {
            ...state,
            newsArticles: [action.article, ...state.newsArticles]
        }
    case 'SET_NEWS_FEED': 
        return {
            ...state,
            newsArticles: [...action.articles, ...state.newsArticles]
        }
    default:
        return {
            ...state
        }
    }
}

export default newsReducer;