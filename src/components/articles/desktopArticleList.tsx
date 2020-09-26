import React from 'react';
import { IonList, IonItem } from '@ionic/react';
import pushid from 'unique-push-id';
import { useSelector } from 'react-redux';
import './Article.scss'
import DesktopArticle from './DesktopArticle';

interface Props {
    news: any[]
} 
  
const DesktopArticleList: React.FC<Props> = ({ news }) => {
    const newsFeed = useSelector((state: any) => state.news.newsArticles)
   
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
                    <DesktopArticle key={index} article={article} id={pushid()} />
                    )
                )
            }
            return noData
        }
    }

    return (
        <IonList>
            {buildList()}
        </IonList>
    );
}

const noData = (
        <IonList>
            <IonItem>
                <div className="card-content">
                    <span >No recent news </span>
                </div>
            </IonItem>
        </IonList>
    );

export default DesktopArticleList