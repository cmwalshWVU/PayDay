import { IonList, IonButton, IonItem, IonLabel } from "@ionic/react";
import React, { useState } from "react";
import NewAccountItem from "./NewAccountItem";
import AccountItem from "./accountItem";
import { ERC20TOKENS } from "../Erc20Tokens";
import { useSelector } from "react-redux";
import './ContactsList.scss'

interface Props {
    openModal: boolean
    openTransak: any
}

const ContactsList: React.FC<Props> = ({openModal, openTransak}) => {
    const user = useSelector((state: any) => state.user.user)
    const contacts = useSelector((state: any) => state.user.contacts)
    
    const [addNewUser, setAddNewUser] = useState(false)

    return (
        <IonList className="contacts-list">
                {user !== null ? 
                  <>
                    <IonButton  onClick={() => setAddNewUser(true)} >
                      Add Contact
                    </IonButton>
                    {addNewUser && <NewAccountItem setAddNewUser={setAddNewUser} />}
                    {contacts.length > 0 ?
                      contacts.map((account: any) => (
                        <AccountItem tokens={ERC20TOKENS} openModal={openModal} ownersAccount={false} account={account} openTransak={openTransak} />
                      )) : 
                        <IonItem>
                          <IonLabel className="center">
                            Add some contacts!
                          </IonLabel>
                        </IonItem>
                      }
                  </>
                  : 
                  <IonItem>
                    <IonLabel className="center">
                      Login to add contacts
                    </IonLabel>
                  </IonItem>
                }
              </IonList>
    )
}

export default ContactsList