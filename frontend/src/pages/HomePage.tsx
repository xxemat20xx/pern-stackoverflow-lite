import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome to Stack Overflow Lite</h1>
                <p className="mt-2 text-gray-600">This is a placeholder home page.</p>
            </div>
        </div>
    );
};

export default HomePage;