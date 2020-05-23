export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const deleteProduct = productId => {
    return { type: DELETE_PRODUCT, productId: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async dispatch => {
        
        const response = await fetch(
            'http://10.0.2.2:8080/products', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        title,
                        description,
                        imageUrl,
                        price,
                        user: {id:1}
                    }
                )
            }
        );
        const resData = await response.json();
             

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.id,
                title,
                description,
                imageUrl,
                price,
                ownerId: resData.user.id
            }
        });
    }
};

export const updateProduct = (id, title, description, imageUrl) => {
    return {
        type: UPDATE_PRODUCT,
        productId: id,
        productData: {
            title,
            description,
            imageUrl
        }
    };
};   