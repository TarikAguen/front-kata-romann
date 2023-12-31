import React, { useState } from 'react';

function Convertisseur() {
  const [chiffreArabe, setChiffreArabe] = useState('');
  const [chiffreRomain, setChiffreRomain] = useState('');
  const [conversionInverse, setConversionInverse] = useState(false);
  const [historique, setHistorique] = useState([]);

  // Gère les changements d'entrée pour les chiffres arabes et romains
  const handleChange = (e) => {
    // Met à jour l'état avec la valeur en majuscule pour les chiffres romains
    setChiffreArabe(e.target.value.toUpperCase());
  };

  // Effectue la conversion en fonction du mode sélectionné
  const convertirChiffre = async () => {
    try {
      // Cherche dans l'historique
      const historiqueEntry = historique.find(entry => entry.input === chiffreArabe);
  
      // evite l'appel API
      if (historiqueEntry) {
        setChiffreRomain(historiqueEntry.output);
        return;
      }
  
      let resultat;
      let url = 'https://arab-to-roman-114f70a02b4f.herokuapp.com/';
  
      // Choisis l'URL en fonction du sens de la conversion
      if (conversionInverse) {
        url += 'reverse'; // Endpoint pour convertir du romain à l'arabe
      } else {
        url += 'convert'; // Endpoint pour convertir de l'arabe au romain
      }
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionInverse ? { roman: chiffreArabe } : { number: chiffreArabe }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la conversion.');
      }
  
      const data = await response.json();
      resultat = conversionInverse ? data.arabic : data.roman;
  
      setChiffreRomain(resultat.toString());
  
      // Ajoute la nouvelle conversion à l'historique
      setHistorique((prevHistorique) => [
        { input: chiffreArabe, output: resultat.toString() },
        ...prevHistorique.slice(0, 4),
      ]);
    } catch (error) {
      console.error(error);
      setChiffreRomain('Chiffre non valide');
    }
  };
  
  

  // Bascule entre les modes de conversion
  const toggleConversion = () => {
    setConversionInverse(!conversionInverse);
    setChiffreArabe('');
    setChiffreRomain('');
  };

  return (
    <div>
      <div className='container'>
        <h1>Convertisseur {conversionInverse ? 'Chiffre Romain en Chiffre Arabe' : 'Chiffre Arabe en Chiffre Romain'}</h1>
        <label htmlFor="chiffreArabe">{conversionInverse ? 'Entrez un chiffre romain :' : 'Entrez un chiffre entre 1 et 3999 :'}</label>
        <input
          type="text"
          id="chiffreArabe"
          placeholder={conversionInverse ? 'Entrez un chiffre romain' : 'Entrez un chiffre arabe'}
          value={chiffreArabe}
          onChange={handleChange}
        />
        <button onClick={convertirChiffre}>{conversionInverse ? 'Convertir en Chiffre Arabe' : 'Convertir en Chiffre Romain'}</button>
        <label htmlFor="chiffreRomain">{conversionInverse ? 'Chiffre Arabe correspondant :' : 'Chiffre Romain correspondant :'}</label>
        <input type="text" id="chiffreRomain" value={chiffreRomain} readOnly />
        <button onClick={toggleConversion}>Changer de mode</button>

        {/* historique */}
        {/* {historique.length > 0 && (
          <div>
            <h2>Historique des conversions</h2>
            <ul>
              {historique.map((entree, index) => (
                <li key={index}>{`Entrée: ${entree.input}, Sortie: ${entree.output}`}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Convertisseur;
