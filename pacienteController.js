import { PacienteRepository } from './pacienteRepository.js';
import { DateTime } from 'luxon';

class PacienteController {
    #pacienteRepository = new PacienteRepository();

    validarCpf(cpf) {
        if (cpf.length !== 11) {
            throw new Error('Erro: CPF precisa ter 11 dígitos');
        }
    
        const digitosCpf = cpf.split('').map(Number);
    
        if (digitosCpf.every(digito => digito === digitosCpf[0])) {
            throw new Error('Erro: CPF não pode ter todos os dígitos iguais');
        }
    
        const digitoVerificador1 = digitosCpf.slice(0, 9).reduce((sum, digit, index) => sum + digit * (10 - index), 0) % 11;
        const testeDigito1 = (digitoVerificador1 < 2) ? 0 : (11 - digitoVerificador1);
    
        const digitoVerificador2 = digitosCpf.slice(0, 10).reduce((sum, digit, index) => sum + digit * (11 - index), 0) % 11;
        const testeDigito2 = (digitoVerificador2 < 2) ? 0 : (11 - digitoVerificador2);
    
        if (testeDigito1 !== digitosCpf[9] || testeDigito2 !== digitosCpf[10]) {
            throw new Error('Erro: CPF inválido');
        }
    }

    validarNome(nome) {
        if(nome.length < 5) {
            throw new Error('Erro: nome precisa ter no mínimo 5 caracteres');
        }
    }

    validarData(dataNascimentoString) {
        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimentoString))
            throw new Error('Erro: data de nascimento precisa estar no formato DD/MM/AAAA');
        
        let [dia, mes, ano] = dataNascimentoString.split('/').map(part => parseInt(part));
        let dataNascimento = DateTime.fromJSDate(new Date(ano, mes-1, dia));
        let idade = DateTime.now().diff(dataNascimento, 'years').years;

        if(idade < 13)
            throw new Error('Erro: paciente deve ter pelo menos 13 anos.');
    }

    cadastrarPaciente(cpf, nome, dataNascimento) {
        if(this.#pacienteRepository.getPacienteByCpf(cpf))
            throw new Error('Erro: CPF já cadastrado');
        this.#pacienteRepository.addPaciente(cpf, nome, dataNascimento);
        console.log("Paciente cadastrado com sucesso!")
    }

    getPacienteByCpf(cpf) {
        return this.#pacienteRepository.getPacienteByCpf(cpf);
    }

    excluirPaciente(cpf) {
        try {
            this.#pacienteRepository.excluirPaciente(cpf);
        } catch(e) {
            console.log(e.message);
        }
    }

    listarPacientesPorCpf() {
        return this.#pacienteRepository.getPacientesPorCpf();
    }

    listarPacientesPorNome() {
        return this.#pacienteRepository.getPacientesPorNome();
    }
}

export {PacienteController}