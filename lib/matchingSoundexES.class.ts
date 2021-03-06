import { SoundexES } from './soundexES.class';
import { IWeight } from './weight.interface';
import { IPerson } from './person.interface';
import { MetaphoneES } from './metaphoneES.class';
import { LibString } from './libString.class';
import * as distance from 'jaro-winkler';

export class MatchingSoundexES {
    private sexMatching(sexA, sexB) {
        if (sexA === sexB) {
            return 1;
        } else {
            return 0;
        }
    }

    private stringMatching(stringA, stringB) {
        let stringAMin = stringA.toLowerCase();
        let stringBMin = stringB.toLowerCase();

        let maxLen = LibString.maxLargo(stringAMin, stringBMin);
        let minLen = LibString.minLargo(stringAMin, stringBMin);
        let coincidencias = 0;


        for (let i = 0; i < minLen; i++) {
            if (stringAMin.charAt(i) === stringBMin.charAt(i)) {
                coincidencias++;
            }
        }

        return coincidencias / maxLen;
    }


    public matchSoundex(identidadA: IPerson, identidadB: IPerson, weights: IWeight): number {

        let algSoundex = new SoundexES();
        // Se obtiene la clave según el algoritmo MetaphoneES
        let claveFirstNameA = algSoundex.soundex(identidadA.firstname);
        let claveFirstNameB = algSoundex.soundex(identidadB.firstname);
        let claveLastNameA = algSoundex.soundex(identidadA.lastname);
        let claveLastNameB = algSoundex.soundex(identidadB.lastname);

        let completeNameA = claveFirstNameA + claveLastNameA;
        let completeNameB = claveFirstNameB + claveLastNameB;

        let v1 = weights.name * distance(completeNameA, completeNameB);  // Se utiliza el algoritmo JaroWinkler sobre las claves foneticas
        let v2 = weights.gender * this.sexMatching(identidadA.gender, identidadB.gender);
        let v3 = weights.birthDate * this.stringMatching(identidadA.birthDate, identidadB.birthDate);
        let v4 = weights.identity * this.stringMatching(identidadA.identity, identidadB.identity);
        let value = Math.round((v1 + v2 + v3 + v4) * 100) / 100;

        return value;
    }
}
