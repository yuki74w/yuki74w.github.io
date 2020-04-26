"use strict"

class subject_category{
    constructor(name_en, name_jp, cources)
    {
        this.name_en = name_en;
        this.name_jp = name_jp;
        this.cources = cources;
    }
};

function create_category() {
    let args = Array.prototype.slice.call(arguments);
    let name_en = args[0];
    let name_jp = args[1];
    let categories = args.slice(2);
    let synthesized_category = class extends subject_category{
        constructor() {
            super(name_en, name_jp,
                categories.map(category => category.cources).reduce(
                    (accumulator, current) => accumulator.concat(current)
                ));
            categories.forEach(element => {
                this[element.name_en] = element;
            });
        }
    };
    let ret = new synthesized_category;
    return ret;
}

const human_society = new subject_category("human_society", "人文社会科学科目", [1]);
const health_sport = new subject_category("health_sport", "健康・スポーツ科学科目", [2])

const general_culture = create_category("general_culture", "総合文化科目", human_society, health_sport);

const subjects = new subject_category("name", "", []);

console.log(general_culture);

export {subjects}