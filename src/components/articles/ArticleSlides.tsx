import React, { useEffect } from 'react';
import { IonCard, IonCardContent, IonContent, IonList, IonGrid, IonRow, IonCol, IonSlides, IonSlide } from '@ionic/react';
import Article from './ArticleSlide';
import Pusher, { Options } from 'pusher-js';
import pushid from 'unique-push-id';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeed } from '../../store/actions/newsActions';

interface Props {
    news: any[]
} 
  
const ArticleListSlides: React.FC<Props> = ({ news }) => {
    const newsFeed = useSelector((state: any) => state.news.newsArticles)
    const dispatch = useDispatch()

    useEffect(() => {
        const pusher = new Pusher('5994b268d4758d733605', {
            cluster: 'us2',
            encrypted: true
        } as Options);
        pusher.subscribe('news-channel').bind('update-news', (data: any) => {
            // news.push(data.articles)
            dispatch(updateFeed(data.articles))
        })
    }, [])
   
    function newArray(x: any, y: any) {
        let d: any[] = []
        x.concat(y).forEach((item: any) =>{
           if (d.find((iterator) => iterator.title  === item.title) === undefined) 
             d.push(item); 
        });
        return d;
      }

    const buildList = () => {
        if (news.length === 0 && newsFeed.length  === 0)  {
            return noData
        }
        else {
            const articles = newArray(news, newsFeed)
            if (articles.length > 0) {
                return articles.sort((a, b) => {
                    if (a.publishedAt !== undefined && b.publishedAt !== undefined) {
                        return a.publishedAt < b.publishedAt ? 1 : -1
                    } else if (a.publishedAt !== undefined && b.published_on !== undefined) {
                        const bT = new Date(b.published_on * 1000)
                        const aT = new Date(a.publishedAt)
                        return aT < bT ? 1 : -1
                    }
                    else if (a.published_on !== undefined && b.publishedAt !== undefined) {
                        const bT = new Date(b.publishedAt)
                        const aT = new Date(a.published_on * 1000)
                        return aT < bT ? 1 : -1
                    }
                    else {
                        return a.published_on < b.published_on ? 1 : -1
                    }
                }).map((article, index)  => (
                    <IonSlide>
                        <Article key={index} article={article} id={pushid()} />
                    </IonSlide>
                    )
                )
            }
            return noData
        }
    }

    const slideOpts = {
        direction: 'vertical',
        
    };
      
    return (
        <IonContent>
            <IonSlides options={slideOpts}>
                {buildList()}
            </IonSlides>
        </IonContent>
    );
}

const noData = (
    <IonSlide>
        <IonList className={"default-background"}>
            <IonGrid fixed>
                <IonRow align-items-stretch>
                <IonCol size="12" size-md="4">
                <IonCard className="speaker-card">
                    <IonCardContent className="card-content grey-text text-darken-3">
                    <div className="card-content">
                        <span >No recent news </span>
                    </div>
                    </IonCardContent>
                </IonCard> 
                </IonCol>                        
                </IonRow>
            </IonGrid>
        </IonList>
    </IonSlide>
    );

export default ArticleListSlides