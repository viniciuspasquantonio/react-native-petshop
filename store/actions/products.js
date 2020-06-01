import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {

    return async (dispatch) => {
        try {
            const response = await fetch('http://10.0.2.2:8080/products');

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedProducts = [];


            for (let entry of resData) {
                loadedProducts.push(new Product(
                    '' + entry.id,
                    entry.user.id,
                    entry.title,
                    entry.imageUrl,
                    entry.description,
                    entry.price
                ));
            }

            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts
            });
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

export const deleteProduct = productId => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/products/${productId}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_PRODUCT, productId: productId });
    };
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
                        user: { id: 29 }
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
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/products/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    user: { id: 29 }
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        dispatch({
            type: UPDATE_PRODUCT,
            productId: id,
            productData: {
                title,
                description,
                imageUrl
            }
        });
    };
};