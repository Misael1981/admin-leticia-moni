import { PatientStatus } from "@/constants/enums"
import { PatientTreatmentType } from "@/data/get-treatments"
import {
  AnamnesesType,
  EvolutionType,
  PatientDetail,
  PhysicalAssessmentType,
} from "@/data/patients.queries"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { formatBirthDate } from "@/helpers/format-birth-date"
import { maskCPF } from "@/helpers/personal-documents"
import {
  BIOLOGICAL_SEX_LABELS,
  EDUCATION_LEVEL_LABELS,
} from "@/constants/labels"

type PrintableRecordProps = {
  status?: PatientStatus
  evolutions: EvolutionType[] | null
  anamnesis: AnamnesesType | null
  patientTreatments: PatientTreatmentType[] | null
  physicalAssessment: PhysicalAssessmentType | null
  patient: PatientDetail
}

// Seção padrão pra blocos de HTML rico (Quill), evita repetição
const RichTextSection = ({
  title,
  html,
}: {
  title: string
  html?: string | null
}) => {
  if (!html) return null

  return (
    <div className="avoid-break mb-4 space-y-2">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="text-sm leading-relaxed text-gray-700 [&_p]:mb-2 [&_p]:last:mb-0"
      />
    </div>
  )
}

const PrintableRecord = ({
  evolutions,
  anamnesis,
  patientTreatments,
  physicalAssessment,
  patient,
}: PrintableRecordProps) => {
  const hasProntuarioContent =
    anamnesis?.mainComplaint ||
    anamnesis?.medicalDiagnosis ||
    anamnesis?.hma ||
    physicalAssessment?.content ||
    (evolutions && evolutions.length > 0)

  return (
    <div className="print-container">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-lg font-bold">Letícia Moni Fisioterapia</h1>
        <p className="text-sm text-gray-600">Prontuário do Paciente</p>
      </header>

      {/* Dados do paciente */}
      <section className="avoid-break mb-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <strong>Nome:</strong> {patient.name}
        </div>
        {patient.cpf && (
          <div>
            <strong>CPF:</strong> {maskCPF(patient.cpf)}
          </div>
        )}
        {patient.birthDate && (
          <div>
            <strong>Data de Nascimento:</strong>{" "}
            {formatBirthDate(patient.birthDate)}
          </div>
        )}
        {patient.phone && (
          <div>
            <strong>Telefone:</strong> {formatPhoneNumber(patient.phone)}
          </div>
        )}
        {patient.biologicalSex && (
          <div>
            <strong>Sexo Biológico:</strong>{" "}
            {BIOLOGICAL_SEX_LABELS[patient.biologicalSex]}
          </div>
        )}
        {patient.gender && (
          <div>
            <strong>Gênero:</strong> {patient.gender}
          </div>
        )}
        {patient.education && (
          <div>
            <strong>Escolaridade:</strong>{" "}
            {EDUCATION_LEVEL_LABELS[patient.education]}
          </div>
        )}
        {patient.profession && (
          <div>
            <strong>Profissão:</strong> {patient.profession}
          </div>
        )}
        {patient.birthCity && (
          <div>
            <strong>Naturalidade:</strong> {patient.birthCity}
          </div>
        )}
        {patient.birthState && (
          <div>
            <strong>Estado natal:</strong> {patient.birthState}
          </div>
        )}
        {patient.nationality && (
          <div>
            <strong>Nacionalidade:</strong> {patient.nationality}
          </div>
        )}
      </section>

      {/* Endereço */}
      {patient.address && (
        <section className="avoid-break mb-6 space-y-2">
          <h2 className="border-b pb-1 text-base font-semibold">Endereço</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {patient.address.street && (
              <div>
                <strong>Logradouro:</strong> {patient.address.street}
              </div>
            )}
            {patient.address.number && (
              <div>
                <strong>Número:</strong> {patient.address.number}
              </div>
            )}
            {patient.address.complement && (
              <div>
                <strong>Complemento:</strong> {patient.address.complement}
              </div>
            )}
            {patient.address.district && (
              <div>
                <strong>Bairro:</strong> {patient.address.district}
              </div>
            )}
            {patient.address.city && (
              <div>
                <strong>Cidade:</strong> {patient.address.city}
              </div>
            )}
            {patient.address.state && (
              <div>
                <strong>Estado:</strong> {patient.address.state}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tratamento (texto simples, não é HTML rico) */}
      {patientTreatments && patientTreatments.length > 0 && (
        <section className="avoid-break mb-4 space-y-2">
          <h3 className="text-base font-semibold text-gray-800">
            Tipo de Tratamento
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {patientTreatments[0].treatment.name}
          </p>
        </section>
      )}

      {/* Prontuário */}
      <section className="mb-6">
        <h2 className="mb-3 border-b pb-1 text-xl font-semibold">Prontuário</h2>

        {hasProntuarioContent ? (
          <div>
            <RichTextSection
              title="Queixa Principal"
              html={anamnesis?.mainComplaint}
            />
            <RichTextSection
              title="Diagnóstico"
              html={anamnesis?.medicalDiagnosis}
            />
            <RichTextSection
              title="Histórico da Queixa (HMA)"
              html={anamnesis?.hma}
            />
            <RichTextSection
              title="Avaliação Física"
              html={physicalAssessment?.content}
            />
            {evolutions && evolutions.length > 0 && (
              <RichTextSection
                title="Nota da Última Evolução"
                html={evolutions[0].notes}
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Nenhuma informação registrada até o momento.
          </p>
        )}
      </section>

      <footer className="mt-8 border-t pt-4 text-xs text-gray-500">
        Documento gerado em {new Date().toLocaleDateString("pt-BR")}
      </footer>
    </div>
  )
}

export default PrintableRecord
