import { signOut } from 'firebase/auth';
import { useState } from 'react'
import {auth} from '../firebase/index';

export default function useSignout() {
    
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(false);
    
    const logout = async () => {
        try {
            setLoading(true);
            let res = await signOut(auth);
            setError('');
            setLoading(false);
            return res.user;
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }   
    }

    return {error, loading, logout}
}
