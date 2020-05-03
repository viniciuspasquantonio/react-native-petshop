import Product from '../models/product';

const PRODUCTS = [
    new Product(
        'p1',
        'u1',
        'Mostra a',
        'https://www.petlove.com.br/images/products/210675/product/Ra%C3%A7%C3%A3o_Golden_Formula_Carne_e_Arroz_para_C%C3%A3es_Adultos_de_Ra%C3%A7as_Pequenas_-_15_Kg_1210471_2.jpg?1562146341',
        'Racao golden',
        1000.00
    ),
    new Product(
        'p2',
        'u2',
        'Covinha',
        'https://www.petlove.com.br/images/products/191775/product/RACAO_MAGNUS_CAES_ADULTOS_SABOR_CARNE_c%C3%B3pia.jpg?1556424996',
        'Racao magnus',
        10.00
    )
];

export default PRODUCTS;