"use client";

import React from 'react';
import styles from './page.module.css';
import { Heart, Code, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function About() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('about.title')}</h1>
                <p className={styles.subtitle}>
                    {t('about.subtitle')}
                </p>
            </header>

            <section className={styles.section}>
                <div className={styles.content}>
                    <h2>{t('about.missionTitle')}</h2>
                    <p>
                        {t('about.missionPara1')}
                    </p>
                    <p>
                        {t('about.missionPara2')}
                    </p>
                </div>
            </section>

            <section className={styles.values}>
                <h2 className={styles.valuesTitle}>{t('about.valuesTitle')}</h2>
                <div className={styles.grid}>
                    <div className={styles.valueCard}>
                        <Heart className={styles.icon} size={40} />
                        <h3>{t('about.value1Title')}</h3>
                        <p>{t('about.value1Desc')}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <Code className={styles.icon} size={40} />
                        <h3>{t('about.value2Title')}</h3>
                        <p>{t('about.value2Desc')}</p>
                    </div>
                    <div className={styles.valueCard}>
                        <Zap className={styles.icon} size={40} />
                        <h3>{t('about.value3Title')}</h3>
                        <p>{t('about.value3Desc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
