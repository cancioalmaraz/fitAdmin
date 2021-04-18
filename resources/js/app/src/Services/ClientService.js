import axios from "axios";

class ClientService {
    getAll(limit = 10, offset = 0, filterList = {}) {
        const urlSearchParams = new URLSearchParams();

        urlSearchParams.append("limit", limit);
        urlSearchParams.append("offset", offset);

        for (const property in filterList) {
            if (filterList[property] !== "" && !!filterList[property]) {
                urlSearchParams.append(
                    `filterList[${property}]`,
                    filterList[property]
                );
            }
        }

        return axios.get("/api/clients", {
            params: urlSearchParams
        });
    }

    getById(id) {
        return axios.get(`/api/clients/${id}`);
    }

    create(client) {
        return axios.post("/api/clients", client);
    }

    edit(client) {
        return axios.put(`/api/clients/${client.id}`, client);
    }

    delete(client) {
        return axios.delete(`/api/clients/${client.id}`);
    }
}

export default ClientService;
