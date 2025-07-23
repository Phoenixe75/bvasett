import React, { createContext, useContext, useState, useEffect } from 'react';
import { ISliders } from '@/app/dashboard/admin/sliders/(models)/sliders';
import { getActiveSlider } from '@/app/dashboard/admin/sliders/(services)/sliders.service';

interface SliderContextType {
    data: ISliders[];
    loading: boolean;
    error: string | null;
    refreshData: () => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const SliderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ISliders[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const sliders = await getActiveSlider();
            if (Array.isArray(sliders)) {
                setData(sliders);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching sliders:', error);
            setError('خطا در دریافت اسلایدرها');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshData = () => {
        fetchData();
    };

    return <SliderContext.Provider value={{ data, loading, error, refreshData }}>{children}</SliderContext.Provider>;
};

export const useSliderContext = () => {
    const context = useContext(SliderContext);
    if (!context) {
        throw new Error('useSliderContext must be used within a SliderProvider');
    }
    return context;
};
