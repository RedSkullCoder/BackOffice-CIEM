import React, {useEffect, useState} from 'react';
import MessagesForm from './MessagesForm';
import {db} from '../firebase';
import {toast} from 'react-toastify';

 const Messages = ()=>{
    const styleh6 = {
        color: 'white',
        fontSize: 200
      };

    const [Mismensajes,setMessages] = useState([]);
    const [currentId, setCurrentId] =  useState('');

    const addOrEditMessages = async (messagesObject) => {
       //console.log(messagesObject);
       await db.collection('Messages').doc().set(messagesObject);
       toast.warn('Mensaje Enviado',{
           type: 'succes',
           autoClose: 2000,
           theme: "dark",
           icon: "🚀"
       });
    }

    
    //DELETE ENTRY
    const onDeleteMessages = async(id) =>{
        if( window.confirm('Estas seguro de eliminar el mensaje')){
          await  db.collection('Messages').doc(id).delete();
        }
       
    }


    //PETITION FB REALTIME
    const getMessages= async() => {
        //TO MERGE THE ID AND OLD DATA
          db.collection("Messages").onSnapshot((querySnapshot)=>{
            const docs = [];
            querySnapshot.forEach(doc =>{
                //Adding id to de row data
               docs.push({...doc.data(), id:doc.id});
            });
            setMessages(docs);
          });
         
     };
// 
    //OBTAIN MESSAGES
    useEffect(() =>{
        getMessages();
    },[])
    return (
    <div>
        <div className="col-md-12 mb-1 d-flex justify-content-between'">
        <MessagesForm {...{addOrEditMessages,currentId,Mismensajes}}/>
        </div>
        
        {/* CALL DE DATA FROM FIREBASE */}
        <div className="col-md-12 ">
            {Mismensajes.map(message =>(
                <div className="card mb-2" key={message.id}>
                    <div className="card-body">
                        <div className='d-flex justify-content-between'>
                        <h6 >{message.asunto}</h6>  
                        <div>
                        <i className="material-icons text-danger"
                         onClick={()=>onDeleteMessages(message.id)}>close</i>

                         <i className="material-icons text-warning"
                         onClick={() => setCurrentId(message.id)}>edit</i>
                         </div>
                        </div>
                        
                        <p>{message.mensaje}</p>
                    </div>
                </div>
            ))}
               
        </div>
    </div>
    )
            }
export default Messages;