import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';


export default function useFirestore() {
  
    // get collection
    let getCollection = (colName, _q, search) => {
        let qRef = useRef(_q).current;
        let [error, setError] = useState('');
        let [data, setData] = useState([]);
        let [loading, setLoading] = useState(false);

        useEffect(() => {
            setLoading(true);
            let ref = collection(db, colName);
            let queries = [];
            if(qRef) {
                queries.push(where(...qRef));
            }
            queries.push(orderBy('date', 'desc'));
            let q = query(ref, ...queries);
            onSnapshot(q, docs => {
                if(docs.empty) {
                    setError('No documents found.');
                    setLoading(false);
                    setData([]);
                } else {
                    let collectionDatas = [];
                    docs.forEach(doc => {
                        let document = { id : doc.id, ...doc.data() }
                        collectionDatas.push(document);
                    })

                    if(search?.field && search?.value) {
                        let searchedDatas = collectionDatas.filter(doc => {   
                            return doc[search?.field].includes(search?.value);
                        })
                        setData(searchedDatas);
                        
                    } 
                    else {
                        setData(collectionDatas);
                    }
                    setLoading(false);
                    setError('');
                }          
            })
        }, [qRef, search?.field, search?.value])

        return {error, data, loading};
    }

    // get document
    let getDocument = (colName, id) => {

        let [error, setError] = useState('');
        let [data, setData] = useState(null);
        let [loading, setLoading] = useState(false);

        useEffect(() => {
            setLoading(true);
            let ref = doc(db, colName, id);
            onSnapshot(ref, doc => {
                if(doc.exists()) {
                    let document = { id : doc.id, ...doc.data()};
                    setData(document);
                    setLoading(false);
                    setError('');
                } else {
                    setError('No document found');
                    setLoading(false);
                }         
            })
        }, [id]);

        return {error, data, loading};
    }

    // add collection
    let addCollection = async (colName, data) => {
        data.date = serverTimestamp();
        let ref = collection(db, colName);
        return addDoc(ref, data);
    }

    // delete document
    let deleteDocument = async (colName, id) => {
        let ref = doc(db, colName, id);
        return deleteDoc(ref);
    }

    // update document
    let updateDocument = async (colName, id, data, updateDate = true) => {
        if(updateDate) {
            data.date = serverTimestamp();  
        }
        let ref = doc(db, colName, id);
        return updateDoc(ref, data);
    }


    return { getCollection, getDocument, addCollection, deleteDocument, updateDocument};
}
