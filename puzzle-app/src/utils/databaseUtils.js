/* eslint-disable react-hooks/rules-of-hooks */
import useFetch from "./useFetch"

export const getAllCroppedImages = (url) => {
    const [data, loading, error] = useFetch(url);
    return {data, loading, error };
}

export const addCroppedImage =  (url, method, body) => {
    const [data, loading, error ] =  useFetch(url, method, body);
    return {data, loading, error};
}