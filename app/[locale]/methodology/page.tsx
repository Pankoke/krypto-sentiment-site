import MethodikPage, { generateMetadata } from '../methodik/page';

export { generateMetadata };

export default function MethodologyPage() {
  return <MethodikPage params={{ locale: 'en' }} />;
}
