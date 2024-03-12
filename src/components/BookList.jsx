import React, { useContext } from 'react';
// import useFetch from '../hooks/useFetch';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import trashIcon from '../assets/trash.svg';
import editIcon from '../assets/edit.svg';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from '../contexts/AuthContext';

export default function BookList() {

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let search = params.get('search');
    let navigate = useNavigate();

    // for json-server
    // let {data : books, loading, error} = useFetch(`http://localhost:3000/books${search ? `?q=${search}` : ''}`);

    // for firebase server
    let { getCollection, deleteDocument } = useFirestore();

    let { user } = useContext(AuthContext);
    let {error, data : books, loading} = getCollection('books', ['uid', '==', user.uid], {
        field : 'title',
        value : search
    });
    

    let deleteBook = async (e, id) => {
        e.preventDefault();
        await deleteDocument('books', id);
        // setBooks(prev => prev.filter(b => b.id !== id));
    }

    
    let { isDark } = useTheme();
    
    if(error) {
        return <p className={`${isDark ? 'text-white' : ''}`}>{error}</p>
    }
 

    return (
        <div>
            {loading && <p className={`${isDark ? 'text-white' : ''}`}>Loading...</p>}
            {/* book list */}
            {!!books && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3">   
                    {books.map((b) => (
                        <Link to={`/books/${b.id}`} key={b.id} >
                            <div className={`border border-1 p-4 min-h-[400px] ${isDark ? 'border-primary bg -dcard text-white' : ''}`}>
                                <img src={b.cover} alt="" />

                                <div className="text-center space-y-2 mt-3">
                                    <h1>{b.title}</h1>
                                    <p>{b.description}</p>
                            
                                    {/* genres */}
                                    <div className='flex justify-between items-center'>
                                        <div className="flex flex-wrap">
                                            {b.categories.map((c) => (
                                                <span key={c} className="text-sm mx-1 my-1 bg-blue-600 text-white rounded-full px-2 py-1">{c}</span>
                                            ))}
                                        </div>

                                        <div className='flex space-x-5 items-center'>
                                            
                                                <img src={editIcon} alt="" onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/edit/${b.id}`)
                                                }}/>
                                            
                                            <img onClick={(e) => deleteBook(e, b.id)} src={trashIcon} alt="" />           
                                        </div>
                                    </div>              
                                </div>
                            </div>
                        </Link>
                    ))}     
                </div>
            )}

            {books && !books.length && <p className='text-center text-xl text-gray-500'>No Search Results Found</p>}
        </div>
    
    )
}
