import WikiContent from './WikiEngine.jsx';

const WikiPage = ({ data, notFoundFlag, history, prevData }) => {
  return (
    <div className="m-4 wiki-page">
      <WikiContent author={data.member} DocTitle={data.title} content={data.content} notFoundFlag={notFoundFlag} history={history} prevContent={prevData ? prevData.content : undefined} />
    </div>
  );
};

export default WikiPage;
