const getResource = async url => {
    const result = await fetch(url);

    if (result.status !== 200) {
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}

const postData = async (url, data) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });

    return await result.json();
}

export { getResource, postData };