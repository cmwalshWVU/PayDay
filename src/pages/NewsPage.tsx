import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRefresher, IonRefresherContent } from '@ionic/react';
import ArticleList from '../components/ArticleList';
import ArticleListSlides from '../components/ArticleSlides';

import { RefresherEventDetail, isPlatform } from '@ionic/core';

interface OwnProps { };

interface DispatchProps { };

interface SpeakerListProps extends OwnProps, DispatchProps { };

const NewsPage: React.FC<SpeakerListProps> = ({}) => {

    const [news, setNews] = useState<any[]>([])

    // useEffect(() => {
    //     fetch('https://mighty-dawn-74394.herokuapp.com/live')
    //         .then(response => response.json())
    //         .then(articles => {
    //             // dispatch(updateN(articles.articles))
    //             setNews(articles);
    //         }).catch(error => console.log(error));
    // }, [])

    function refresh(event: CustomEvent<RefresherEventDetail>) {
        fetch('https://mighty-dawn-74394.herokuapp.com/live')
            .then(response => response.json())
            .then(articles => {
                // dispatch(updateN(articles.articles))
                setNews(articles);
                event.detail.complete();
            }).catch(error => {
                event.detail.complete();
            }
        );
    }

    return (
        <IonPage id="news-page">
           
            <IonHeader>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent>
                    </IonRefresherContent>
                </IonRefresher>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Recent News</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className={`outer-content`}>
                
                {/* {isPlatform("mobile") ?  */}
                    {/* <ArticleListSlides news={news} /> */}
                    {/* : */}
                    <ArticleList news={news} />
                {/* } */}
            </IonContent>
        </IonPage>
    );
};

export default React.memo(NewsPage)