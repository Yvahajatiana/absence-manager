// Script de test pour le nouveau modèle Absence
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

const testData = {
  dateDebut: '2024-02-15',
  dateFin: '2024-02-20',
  firstname: 'Marie',
  lastname: 'Martin',
  phone: '0145678901',
  email: 'marie.martin@email.fr',
  adresseDomicile: '456 Avenue des Champs-Élysées, 75008 Paris, France'
};

async function testAPI() {
  try {
    console.log('🧪 Test du nouveau modèle Absence\n');

    // Test health check
    console.log('1. Test health check...');
    const healthResponse = await axios.get(`${API_BASE.replace('/api', '')}/health`);
    console.log('✅ Health check OK:', healthResponse.data.message);

    // Test création d'absence
    console.log('\n2. Test création d\'absence...');
    const createResponse = await axios.post(`${API_BASE}/absences`, testData);
    console.log('✅ Absence créée:', createResponse.data.data);
    const absenceId = createResponse.data.data.id;

    // Test récupération d'absence
    console.log('\n3. Test récupération d\'absence...');
    const getResponse = await axios.get(`${API_BASE}/absences/${absenceId}`);
    console.log('✅ Absence récupérée:', getResponse.data.data);

    // Test modification d'absence
    console.log('\n4. Test modification d\'absence...');
    const updateData = { ...testData, firstname: 'Marie-Claire', email: 'marie-claire.martin@email.fr' };
    const updateResponse = await axios.put(`${API_BASE}/absences/${absenceId}`, updateData);
    console.log('✅ Absence modifiée:', updateResponse.data.data);

    // Test liste des absences
    console.log('\n5. Test liste des absences...');
    const listResponse = await axios.get(`${API_BASE}/absences`);
    console.log('✅ Liste des absences:', listResponse.data.data.length, 'absence(s)');

    console.log('\n🎉 Tous les tests ont réussi ! Le nouveau modèle fonctionne parfaitement.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ajouter axios comme dépendance si pas présent
try {
  require('axios');
} catch (e) {
  console.log('Installation d\'axios pour les tests...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

testAPI();