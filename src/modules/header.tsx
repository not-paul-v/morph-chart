import React from "react";
import { DynamicHeaderData } from "../types/types";
import styles from "../styles.module.css";

interface HeaderProps {
    headerConfig: any;
    headerData: DynamicHeaderData;
}

export const Header: React.FC<HeaderProps> = ({ headerConfig, headerData }) => {
    return (
        <div>
            <h1 className={styles.title}>{headerData.title}</h1>
            {!headerConfig.currentValue.display ? null : (
                <h1 className={styles.dpValue}>{headerData.dataPointValue}</h1>
            )}
            {!headerConfig.percentageChange.display &&
            !headerConfig.labels.display ? null : (
                <div>
                    <p className={styles.percentChange}>
                        {headerConfig.percentageChange.display
                            ? `${headerData.percentChange}%`
                            : null}
                    </p>
                    <p className={styles.label}>
                        {headerConfig.labels.display ? headerData.label : null}
                    </p>
                </div>
            )}
        </div>
    );
};
