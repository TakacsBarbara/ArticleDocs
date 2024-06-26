const ARTICLE_UPLOAD_DOCS_URL = process.env.REACT_APP_ARTICLE_UPLOAD_DOCS_URL;

export async function uploadFiles(formData) {
  
    const response = await fetch(`${ARTICLE_UPLOAD_DOCS_URL}`, {
        method: 'POST',
        cache: 'no-cache',
        body: formData,
    }).catch((error) => {
        console.log(error);
    });

    return response;
}