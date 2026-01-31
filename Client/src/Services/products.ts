import Api from '@/lib/Api';



export const fetchSingleProduct = async (id : string) => {
  const { data } = await Api.get(`/product/${id}`);
  
  if (!data.product) {
    throw new Error('Product not found');
  }
  
  return data.product;
};
