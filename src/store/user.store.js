import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/store';

const baseUrl = `/api/users`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        user: {},
        currentUser: {}
    }),
    actions: {
        async setUser(user) {
            await fetchWrapper.post(`${baseUrl}`, user);
        },
        async getAll() {
            this.users = { loading: true };
            try {
                this.users = await fetchWrapper.get(`${baseUrl}/role/STUDENT`);    
            } catch (error) {
                this.users = { error };
            }
        },
        async getById(id) {
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
        },
        async getCurrentUserById(id) {
            this.currentUser = { loading: true };
            try {
                this.currentUser = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.currentUser = { error };
            }
        },
        async getReportById(id) {
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
        },
        async getByName(name) {
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${name}`);
            } catch (error) {
                this.user = { error };
            }
        },
        async getAllUserByName(name) {
            this.users = { loading: true };
            try {
                this.users = await fetchWrapper.get(`${baseUrl}/name/${name}`);
            } catch (error) {
                this.users = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('usersession', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            console.log('deletes')
            // add isDeleting prop to user being deleted
            // this.users.find(x => x.id === id).markForDelete = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.users = this.users.filter(x => x.id !== id);

            // // auto logout if the logged in user deleted their own record
            // const authStore = useAuthStore();
            // if (id === authStore.user.id) {
            //     authStore.logout();
            // }
        }
    }
});