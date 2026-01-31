import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button
            size="lg"
            className="animate-fade-in-down"
            variant="secondary"
          >Go back home</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;


