import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import styles from './AddToCart.module.css';
import { useToast } from '../../context/Toast.context';
import { useUser } from '../../context/User.context';
import { getUserFromLS, verifySession } from '../../services/auth.service';
import { getCookie } from '../../services/helpers/storageHelpers/cookie.helper';
import Button from '../atoms/Button';

const AddToCartComponent = ({ showCount, product }) => {
  const [count, setCount] = useState(0);
  const { addItemInCart, removeItemFromCart } = useUser();
  const { notify } = useToast();

  const addItem = () => {
    verifySession();
    const currentItemCount = addItemInCart(product);
    setCount(currentItemCount);
    notify('success', 'Item added to cart');
  };

  const removeItem = () => {
    verifySession();
    const currentItemCount = removeItemFromCart(product);
    setCount(currentItemCount);
    notify('success', 'Item removed from cart');
  };

  useEffect(() => {
    verifySession();
    const decryptedUserName = getCookie('token');
    const user = getUserFromLS(decryptedUserName);
    if (user) {
      setCount(user.cart[product.id]?.count ?? 0);
    }
  }, []);

  return (
    <div className={styles.buttonContainer}>
      <Button
        text="+"
        size="rounded"
        backgroundColor="#DACOA3"
        onClick={addItem}
      />
      {showCount ? (
        <p className={styles.count}>{count}</p>
      ) : (
        <span className={styles.countOnCart}>{count}</span>
      )}
      <Button
        text="-"
        size="rounded"
        disabled={count <= 0}
        backgroundColor="#DACOA3"
        onClick={removeItem}
      />
    </div>
  );
};

AddToCartComponent.propTypes = {
  showCount: PropTypes.bool.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
    count: PropTypes.number,
  }).isRequired,
};

export default AddToCartComponent;
