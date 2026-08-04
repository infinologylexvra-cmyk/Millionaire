import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../../constants/config';

const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} | ${APP_NAME}` : `${APP_NAME} | Exclusive VIP Mobile Numbers in India`}</title>
    <meta
      name="description"
      content={description || 'Buy exclusive VIP, fancy and premium mobile numbers across India. Verified sellers, secure payments, doorstep delivery.'}
    />
  </Helmet>
);

export default SEO;
