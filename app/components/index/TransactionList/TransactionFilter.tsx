import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { FilterButton } from './filters/FilterButton';
import { TypeSelector } from './filters/TypeSelector';
import { SortSelector } from './filters/SortSelector';
import { DateRangeSelector } from './filters/DateRangeSelector';
import { AmountRangeSelector } from './filters/AmountRangeSelector';
import { FilterOptions } from './filters/FilterTypes';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { BaseModal } from '../../common/Modal/BaseModal';

interface TransactionFilterProps {
    filterOptions: FilterOptions;
    onFilterChange: (newFilters: FilterOptions) => void;
    onApply: () => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
    filterOptions,
    onFilterChange,
    onApply,
}) => {
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [tempFilters, setTempFilters] = useState<FilterOptions>(filterOptions);
    const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

    // Count active filters whenever tempFilters changes
    useEffect(() => {
        let count = 0;
        if (filterOptions.type && filterOptions.type !== 'all') count++;
        if (filterOptions.fromDate) count++;
        if (filterOptions.toDate) count++;
        if (filterOptions.minAmount && filterOptions.minAmount.trim() !== '') count++;
        if (filterOptions.maxAmount && filterOptions.maxAmount.trim() !== '') count++;
        setActiveFiltersCount(count);
    }, [filterOptions]);

    // Clear filters
    const handleClearFilters = () => {
        const resetFilters: FilterOptions = {
            type: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
            fromDate: null,
            toDate: null,
            minAmount: '',
            maxAmount: '',
        };
        setTempFilters(resetFilters);
    };

    // Apply filters and close modal
    const handleApplyFilters = () => {
        onFilterChange(tempFilters);
        setIsFilterModalVisible(false);
        onApply();
    };

    // Handle date changes
    const handleFromDateChange = (event: any, selectedDate?: Date) => {
        setShowFromDatePicker(false);
        if (selectedDate) {
            setTempFilters({ ...tempFilters, fromDate: selectedDate });
        }
    };

    const handleToDateChange = (event: any, selectedDate?: Date) => {
        setShowToDatePicker(false);
        if (selectedDate) {
            setTempFilters({ ...tempFilters, toDate: selectedDate });
        }
    };

    return (
        <View>
            <FilterButton
                activeFiltersCount={activeFiltersCount}
                onPress={() => setIsFilterModalVisible(true)}
            />
            <BaseModal visible={isFilterModalVisible} onClose={() => setIsFilterModalVisible(false)}>
                <View style={styles.modalHeader}>
                    <ThemedText style={styles.modalTitle}>Filter Transactions</ThemedText>
                    <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} style={styles.closeButton}>
                        <FontAwesome name="times" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.filterContent}>
                    <TypeSelector
                        selectedType={tempFilters.type || 'all'}
                        onTypeChange={(type) => setTempFilters({ ...tempFilters, type })}
                    />

                    <SortSelector
                        sortBy={tempFilters.sortBy || 'date'}
                        sortOrder={tempFilters.sortOrder || 'desc'}
                        onSortByChange={(sortBy) => setTempFilters({ ...tempFilters, sortBy })}
                        onSortOrderChange={(sortOrder) => setTempFilters({ ...tempFilters, sortOrder })}
                    />

                    <DateRangeSelector
                        fromDate={tempFilters.fromDate || null}
                        toDate={tempFilters.toDate || null}
                        showFromDatePicker={showFromDatePicker}
                        showToDatePicker={showToDatePicker}
                        setShowFromDatePicker={setShowFromDatePicker}
                        setShowToDatePicker={setShowToDatePicker}
                        handleFromDateChange={handleFromDateChange}
                        handleToDateChange={handleToDateChange}
                    />

                    <AmountRangeSelector
                        minAmount={tempFilters.minAmount || ''}
                        maxAmount={tempFilters.maxAmount || ''}
                        onMinAmountChange={(value) => setTempFilters({ ...tempFilters, minAmount: value })}
                        onMaxAmountChange={(value) => setTempFilters({ ...tempFilters, maxAmount: value })}
                    />
                </ScrollView>

                <View style={styles.filterActions}>
                    <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                        <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                        <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
                    </TouchableOpacity>
                </View>

            </BaseModal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 8,
    },
    filterContent: {
        maxHeight: '70%',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    clearButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCC',
    },
    clearButtonText: {
        color: '#CCC',
        fontSize: 16,
        fontWeight: '500',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#3700B3',
        alignItems: 'center',
        marginLeft: 8,
        borderRadius: 8,
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
});