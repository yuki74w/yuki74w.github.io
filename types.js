function name(obj, name)
{
    obj.constructor.prototype.name = name;
}

function get_datatype(obj)
{
    let str = Object.prototype.toString.call(obj);
    return str.slice(8, -1);
}

function get_objectname(obj)
{
    var is_named = Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(obj), "name");
    if (is_named)
    {
        return obj.name;
    } else {
        return undefined;
    }
}

function is_same_type(a, b)
{
    let a_type_str = get_datatype(a);
    let b_type_str = get_datatype(b);
    let is_same_datatype = (a_type_str == b_type_str);
    if (is_same_datatype)
    {
        if (a_type_str == "Object")
        {
            let a_name_str = get_objectname(a);
            let b_name_str = get_objectname(b);
            if (a_name_str == undefined || b_name_str == undefined)
                return false;
            return (a_name_str == b_name_str);
        }
        return true;
    } else {
        return false;
    }
}

function check(original, types)
{
    let result = false;
    original.forEach((element, index) => {
        if (!original.hasOwnProperty("prototype")) {
            original[index] = element.prototype;
        }
    });
    original.forEach((element, index) => {
        result |= is_same_type(element, types[index]);
    });
    return result;
}

export { name, is_same_type, check }