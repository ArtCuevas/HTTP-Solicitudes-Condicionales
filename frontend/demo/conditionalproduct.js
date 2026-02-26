const urlBase = 'localhost:3000';

document.getElementById('fetchData').addEventListener('click', () => {
    const lastModified = localStorage.getItem('lastModified');
    const headers = {};
    if (lastModified){
        headers['If-Modified-Since'] = lastModified;
    }

    fetch(`http://${urlBase}/product`, { 
        method: 'GET',
        headers: headers 
    }).then(response => {
        const dataContainer = document.getElementById('dataContainer');
        if (response.status === 304){
            console.log('El recurso no ha cambiado (304 Not Modified).');
            dataContainer.innerHTML = '<p>El recurso no ha cambiado desde la última consulta.</p>';
            return null;
        } else {
            return response.json().then(data => {
                const newLastModified = response.headers.get('Last-Modified')
                if (newLastModified) {
                    localStorage.setItem('lastModified', newLastModified);
                    console.log('Guardando nueva fecha Last-Modified:', newLastModified);

                }
                return data;
            });
        }
    }).then(data => {
        if(data){
            const dataContainer = document.getElementById('dataContainer');
            dataContainer.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            <p>Precio: $${data.price}</p>`;
        }
    }).catch(error => {
        console.error('Error fetching data:', error);   
    });
});