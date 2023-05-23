import { useSendbird } from 'hooks/useSendbird';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routers';

const HomePage: FC = () => {
  const { setupUser } = useSendbird();
  useEffect(() => {
    setupUser();
  }, []);

  return (
    <>
      <div>
        <h1>Basic Code Samples</h1>
        <ul>
          <li>
            <Link to={`${ROUTE_PATH.GROUP_CHANNEL}`}>Basic Group Channel</Link>
          </li>

          <li>
            <Link to={`${ROUTE_PATH.CHAT}`}>CHAT</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HomePage;
