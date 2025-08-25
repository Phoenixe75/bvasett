import {TRANSLATIONS} from '@/app/(main)/(pages)/filterResult/translation';
import {postFavorite} from '@/app/components/FilterItem/(services)/filter.service';
import {useUserContext} from '@/layout/context/usercontext';
import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import styles from './favorite.module.scss';
import classNames from 'classnames';

export default function Favorite({data}: { data: any }) {
  const [isFavorite, setIsFavorite] = useState(data.is_favorite as boolean);
  const isLoading = useRef(false);
  const {user} = useUserContext();

  useEffect(() => {
    setIsFavorite(data.is_favorite);
  }, [data]);
  const toggleFavorite = async () => {
    if (!user || !user.id) {
      toast.error(TRANSLATIONS.notLoginFavoriteError);
      return;
    }
    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    let preValue = isFavorite;
    try {
      setIsFavorite((pre) => {
        preValue = pre;
        return !pre;
      });
      const result = await postFavorite(data.id);
    } catch (error) {
      setIsFavorite(preValue);
    } finally {
      isLoading.current = false;
    }
  };
  return (
    <div className={styles.wrapper}>
      <i
        className={classNames('pi pointer', {
          [styles.wrapper_fill]: isFavorite,
          ['pi-bookmark-fill']: isFavorite,
          ['pi-bookmark']: !isFavorite
        })}
        style={{fontSize: '1rem'}}
        onClick={toggleFavorite}
      ></i>
    </div>
  );
}
