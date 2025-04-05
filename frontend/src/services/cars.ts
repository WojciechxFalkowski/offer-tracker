import api from "./api";

const getBrandsAndModels = async () => {
    const response = await api.get('/api/cars/brands-and-models');
    return response.data;
};

export default getBrandsAndModels;

