import moment from "moment";
import { IonCardSubtitle, IonCardTitle, IonItem, IonLabel } from "@ionic/react";
import React from "react"
import "../styles/Article.scss"

interface Props {
    article: any,
    id: any
}

const DesktopArticle: React.FC<Props> = ({article, id}) => {
    let url = article.urlToImage !== undefined ? article.urlToImage : article.imageurl;
    const date = article.publishedAt !== undefined ? moment(article.publishedAt).format("llll") :
      moment(article.published_on * 1000).format("llll")

    function addDefaultSrc(ev: any){
        console.log("IMG ERROR")
        ev.target.src = 'https://via.placeholder.com/150'
    }

    return (
        <IonItem className="article-item desktop-article">
            <img className={"article-img"} src={url} alt="N/A" onError={addDefaultSrc}  />
            <IonLabel className="article-content">
                <IonCardSubtitle>
                    {article.source_info ? article.source_info.name : article.source.name}
                </IonCardSubtitle>
                <IonCardTitle className={"articleTitle"}>
                    {article.title} 
                </IonCardTitle>
                <IonCardSubtitle>
                    <div className="articleDate">{date}</div>
                </IonCardSubtitle>
                <p className="article-body">
                    {article.body ? article.body.substring(0, 250) + "..." : article.description ? article.description.substring(0, 250) + "..." : ""}
                    <div className={"read-more"}>
                        <a className="readMore" href={`${article.url}`} target="_blank" rel="noopener noreferrer" >Read More</a>
                    </div>
                </p>
            </IonLabel>
        </IonItem>
    )
}

export default DesktopArticle