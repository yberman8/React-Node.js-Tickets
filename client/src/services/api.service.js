import { axiosInstance as axios } from './axiosInstance'

const LOGIN = () => 'auth/login';
const VERIFY_BY_EMAIL = () => 'auth/verify_code';

const CREATE_USER = () => 'users/create_user';
const EDIT_USER = () => 'users/edit_user';
const DELETE_USER = () => 'users/delete_user';

const GET_ALL_USERS = () => 'users/get_users';
const SWITCH_TO_USER = () => 'users/swich_to_user';


const GET_ALL_TICKETS = () => 'tickets/get_tickets';
const CREATE_TICKET = () => 'tickets/create_ticket';
const REPLAY_MESSAGE = () => 'tickets/reply_message';
const GET_TICKETS_MESSAGES = () => 'tickets/get_ticket_messages';
const MARK_AS_READ = () => 'tickets/mark_as_read';
const CLOSE_TICKET = () => 'tickets/close_ticket';



const setHeaders = () => {
    const token = localStorage.getItem('token') || null; // Set token to null if not found
    return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
    }
};

export const login = (body) => {
    return axios.post(LOGIN(), body, {headers: setHeaders()});
};

export const vertifyByEmail = (body) => {
    return axios.post(VERIFY_BY_EMAIL(), body, {headers: setHeaders()});
};


export const createUser = (body) => {
    return axios.post(CREATE_USER(), body, {headers: setHeaders()});
};

export const editUser = (body) => {
    return axios.put(EDIT_USER(), body, {headers: setHeaders()});
};

export const deleteUser = (params) => {
    return axios.delete(DELETE_USER(), {headers: setHeaders(), params});
};


export const getAllUsers = () => {
    return axios.get(GET_ALL_USERS(), {headers: setHeaders()});
};

export const switchToUser = (body) => {
    return axios.post(SWITCH_TO_USER(), body, {headers: setHeaders()});
};



export const getAllTickets = () => {
    return axios.get(GET_ALL_TICKETS(), {headers: setHeaders()});
};

export const createTicket = (body) => {
    return axios.post(CREATE_TICKET(), body, {headers: setHeaders()});
};



export const getTicketMessages = (params) => {
    return axios.get(GET_TICKETS_MESSAGES(), { headers: setHeaders(), params });
};

export const replayToMessage = (Body) => {
    return axios.post(REPLAY_MESSAGE(), Body, {headers: setHeaders()});
};

export const markAsRead = (params) => {
    return axios.get(MARK_AS_READ(), { headers: setHeaders(), params });
};

export const closeTicket = (params) => {
    return axios.get(CLOSE_TICKET(), { headers: setHeaders(), params });
};