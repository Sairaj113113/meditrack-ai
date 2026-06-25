import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function QuickMedicineCard({ medicine, onPress, onArchive, onDelete }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 0.5, borderColor: '#EEF2FF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#0B1F3A' }}>{medicine.medicineName}</Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{medicine.intakeInstruction || ''}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={onArchive} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: '#F59E0B', fontWeight: '700' }}>Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: '#EF4444', fontWeight: '700' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
