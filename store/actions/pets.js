import Pet from "../../models/pet";
import { CREATE_CUSTOMER_PET } from './customers';


export const DELETE_PET = 'DELETE_PET';

export const deletePet = petId => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/pets/${petId}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_PET, petId: petId });
    };
};

export const createPet = (customer, name, petType, gender,size) => {
    return async dispatch => {        
        const response = await fetch(
            'http://10.0.2.2:8080/pets',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name,
                        petType,                        
                        customer,
                        gender,
                        size
                    }
                )
            }
        );

        const resData = await response.json();        
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        
        const newPet = new Pet(
            resData.id,                
            resData.customer,
            resData.name,
            resData.petType,
            resData.gender,
            resData.size
        );
        
        dispatch({
            type: CREATE_CUSTOMER_PET,
            petId: resData.id,
            petData: {                
                pet: newPet
            }
        });

        return newPet;
        
    }
};

export const updatePet = (id, customer, name, petType, gender,size) => {
    return async (dispatch) => {
        const response = await fetch(
            `http://10.0.2.2:8080/pets/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    petType,
                    customer,
                    gender,
                    size
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        dispatch({
            type: UPDATE_PET,
            petId: id,
            petData: {
                name,
                petType,
                customer,
                gender,
                size
            }
        });
    };
};