import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRefresher, IonRefresherContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import ArticleList from '../../components/articles/mobile/ArticleList';

import { RefresherEventDetail } from '@ionic/core';
import { useSelector } from 'react-redux';

interface OwnProps { };

interface DispatchProps { };

interface SpeakerListProps extends OwnProps, DispatchProps { };

const NewsPage: React.FC<SpeakerListProps> = ({}) => {

    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

    const [news, setNews] = useState<any[]>([])

    function refresh(event: CustomEvent<RefresherEventDetail>) {
        fetch('https://mighty-dawn-74394.herokuapp.com/live')
            .then(response => {
                event.detail.complete();
                return response.json()
            }).then(articles => {
                // dispatch(updateN(articles.articles))
                setNews(articles);
                event.detail.complete();
            }).catch(error => {
                event.detail.complete();
            }
        );
    }

    return (
        // <IonPage id="news-page">
            <IonContent className={`${useDarkMode ? null : "light-card"} outer-content`}>
                <IonCardTitle className={"accounts-title"} >
                    News
                </IonCardTitle>
                {/* <IonRefresher slot="fixed" onIonRefresh={refresh}/> */}
                <ArticleList news={news} />
            </IonContent>
        // </IonPage>
    );
};

export default React.memo(NewsPage)