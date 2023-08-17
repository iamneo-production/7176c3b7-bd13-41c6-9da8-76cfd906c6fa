import { useEffect, useState } from "react";

const useFetch = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);


    function requestCall(url, method = "GET", body = null) {
        let header = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (body) {
            header.body = JSON.stringify(body);
        }
        const request = new Request(url, header);
        console.log(request);
        fetch(request)
            .then((res) => res.json())
            .then((data) => {
                try {
                    setLoading(false)
                    setData(data)
                } catch {
                    console.error("Network error");
                    setError("Network error!!!!");
                }
            })
            .catch((error) => {
                setError(error);
                console.log(error);
            })
    }

    return [{ data, loading, error }, requestCall];
}

export default useFetch;