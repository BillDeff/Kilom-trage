import { useState } from "react";
import * as XLSX from "xlsx";

export default function JournalKilometrage() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: "",
    depart: "",
    arrivee: "",
    but: "",
    kmDebut: "",
    kmFin: "",
    usage: "Professionnel",
    commentaires: ""
  });

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const addEntry = () => {
    if (!newEntry.kmDebut || !newEntry.kmFin) return;
    const kmTotal = parseFloat(newEntry.kmFin) - parseFloat(newEntry.kmDebut);
    setEntries([...entries, { ...newEntry, kmTotal }]);
    setNewEntry({
      date: "",
      depart: "",
      arrivee: "",
      but: "",
      kmDebut: "",
      kmFin: "",
      usage: "Professionnel",
      commentaires: ""
    });
  };

  const totalKM = (type) => {
    return entries
      .filter((e) => e.usage === type)
      .reduce((sum, e) => sum + e.kmTotal, 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kilometrage");
    XLSX.writeFile(workbook, "journal_kilometrage.xlsx");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Journal de Kilométrage</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(newEntry).map(([key, value]) =>
          key !== "usage" ? (
            <input
              key={key}
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key}
              className="border rounded p-2"
            />
          ) : (
            <select
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="Professionnel">Professionnel</option>
              <option value="Personnel">Personnel</option>
            </select>
          )
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={addEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter une entrée
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exporter vers Excel
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Entrées enregistrées</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2">Date</th>
              <th className="border px-2">Départ</th>
              <th className="border px-2">Arrivée</th>
              <th className="border px-2">But</th>
              <th className="border px-2">KM début</th>
              <th className="border px-2">KM fin</th>
              <th className="border px-2">KM total</th>
              <th className="border px-2">Usage</th>
              <th className="border px-2">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="border px-2">{entry.date}</td>
                <td className="border px-2">{entry.depart}</td>
                <td className="border px-2">{entry.arrivee}</td>
                <td className="border px-2">{entry.but}</td>
                <td className="border px-2">{entry.kmDebut}</td>
                <td className="border px-2">{entry.kmFin}</td>
                <td className="border px-2">{entry.kmTotal}</td>
                <td className="border px-2">{entry.usage}</td>
                <td className="border px-2">{entry.commentaires}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <p>Total KM Professionnel : <strong>{totalKM("Professionnel")}</strong></p>
          <p>Total KM Personnel : <strong>{totalKM("Personnel")}</strong></p>
        </div>
      </div>
    </div>
  );
}
