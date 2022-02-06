const moduleName = 'users';

const GET_USERS = `${moduleName}/GET_USERS`;
const UPDATE_SELECTED_COLUMNS = `${moduleName}/UPDATE_SELECTED_COLUMNS`;

const defaultState = {
    users: [],
    allColumns: [
        {
            id: 'id',
            content: 'Id',
        },
        {
            id: 'name',
            content: 'Name',
        },
        {
            id: 'username',
            content: 'Username',
        },
        {
            id: 'email',
            content: 'Email',
        },
        {
            id: 'address_street',
            content: 'Street',
        },
        {
            id: 'address_suite',
            content: 'Suite',
        },
        {
            id: 'address_city',
            content: 'City',
        },
        {
            id: 'address_zipcode',
            content: 'Zipcode',
        },
        {
            id: 'phone',
            content: 'Phone',
        },
        {
            id: 'website',
            content: 'Website',
        },
        {
            id: 'company_name',
            content: 'Company',
        },
    ],
    selectedColumns: [
        {
            id: 'id',
            content: 'Id',
        },
        {
            id: 'name',
            content: 'Name',
        },
        {
            id: 'username',
            content: 'Username',
        },
        {
            id: 'email',
            content: 'Email',
        },
    ],
};

export default (state = defaultState, {type, payload}) => {
    switch (type){
        case GET_USERS:
            return {...state, users: payload};
        case UPDATE_SELECTED_COLUMNS:
            return {...state, selectedColumns: payload};
        default:
            return state;
    }
};

export const getUsers = () => async (dispatch) => {
   try {
       await fetch('https://jsonplaceholder.typicode.com/users')
           .then(response => response.json())
           .then((data) => dispatch({type: GET_USERS, payload: data}))
   } catch (e) {
       console.log(e)
   }
};

export const updateSelectedColumns = (data) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_SELECTED_COLUMNS, payload: data})
    } catch (e) {
        console.log(e)
    }
};
